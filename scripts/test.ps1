param(
  [ValidateSet("quick", "docs", "visual", "mobile-like", "full")]
  [string]$Tier = "quick"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

function Resolve-Tool {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$EnvName
  )

  $explicit = [Environment]::GetEnvironmentVariable($EnvName)
  if ($explicit) {
    if (Test-Path -LiteralPath $explicit) { return $explicit }
    throw "$EnvName points to a missing path: $explicit"
  }

  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  throw "Missing required tool '$Name'. Set $EnvName to its executable path."
}

function Step {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][scriptblock]$Body
  )
  Write-Host "== $Name"
  & $Body
}

function Assert-Path {
  param([Parameter(Mandatory = $true)][string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing required path: $Path"
  }
}

function Assert-Contains {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Text
  )
  $content = Get-Content -LiteralPath $Path -Raw
  if (-not $content.Contains($Text)) {
    throw "Expected '$Path' to contain '$Text'"
  }
}

function Invoke-Node {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  & $script:Node @Args
  if ($LASTEXITCODE -ne 0) { throw "node failed: $($Args -join ' ')" }
}

function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
  & $script:Git @Args
  if ($LASTEXITCODE -ne 0) { throw "git failed: $($Args -join ' ')" }
}

function Invoke-QuickChecks {
  Step "JavaScript syntax" {
    Invoke-Node @("--check", "app.js")
  }

  Step "Manifest JSON" {
    Invoke-Node @("-e", "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))")
  }

  Step "Git whitespace" {
    Invoke-Git @("diff", "--check")
  }

  Step "Brain dump extraction" {
    Invoke-Node @("scripts/check-brain-dump.js")
  }

  Step "Required static files" {
    @(
      "index.html",
      "styles.css",
      "app.js",
      "sw.js",
      "manifest.webmanifest",
      "icon.svg",
      "README.md",
      "AGENTS.md"
    ) | ForEach-Object { Assert-Path $_ }
  }

  Step "Required DOM hooks" {
    @(
      "recommendationPanel",
      "todayTimeline",
      "todayQueueList",
      "quickCaptureForm",
      "wizardView",
      "detailDialog",
      "focusDialog"
    ) | ForEach-Object { Assert-Contains "index.html" $_ }
  }

  Step "Service worker asset list" {
    @(
      "./",
      "./index.html",
      "./styles.css",
      "./app.js",
      "./manifest.webmanifest",
      "./icon.svg"
    ) | ForEach-Object { Assert-Contains "sw.js" $_ }
    Assert-Contains "sw.js" "life-command-center-v"
  }

  Step "ASCII scan" {
    $paths = Get-ChildItem -Recurse -File |
      Where-Object {
        $_.FullName -notmatch "\\.git\\" -and
        $_.Extension -in @(".md", ".js", ".html", ".css", ".webmanifest", ".yml", ".yaml", ".ps1", ".svg", ".gitignore")
      }

    foreach ($path in $paths) {
      $matches = Select-String -LiteralPath $path.FullName -Pattern "[^\x00-\x7F]" -AllMatches
      if ($matches) {
        $relative = Resolve-Path -LiteralPath $path.FullName -Relative
        throw "Non-ASCII content found in $relative"
      }
    }
  }
}

function Invoke-DocsChecks {
  Invoke-QuickChecks

  Step "Documentation set" {
    @(
      "docs/current/ARCHITECTURE.md",
      "docs/current/TOOLING.md",
      "docs/planning/NEXT_MILESTONES.md",
      "docs/GITHUB_ISSUE_WORKFLOW.md",
      "docs/AGENT_HANDOFF_TEMPLATE.md",
      ".github/ISSUE_TEMPLATE/feature_task.yml",
      ".github/ISSUE_TEMPLATE/bug_report.yml",
      ".github/pull_request_template.md"
    ) | ForEach-Object { Assert-Path $_ }
  }

  Step "Agent guide links" {
    Assert-Contains "AGENTS.md" "docs/current/ARCHITECTURE.md"
    Assert-Contains "AGENTS.md" "scripts/test.ps1"
    Assert-Contains "AGENTS.md" "GitHub Pages"
  }
}

function Invoke-VisualChecks {
  Invoke-QuickChecks

  Step "Visual surface hooks" {
    @(
      "renderTodayTimeline",
      "timelineBucket",
      "itemTone",
      "itemGlyph",
      "queue-doing-button",
      "focus-pill"
    ) | ForEach-Object { Assert-Contains "app.js" $_ }

    @(
      ".today-timeline",
      ".timeline-group",
      ".timeline-item",
      ".today-queue-row",
      ".queue-done-button",
      "body[data-mode=`"work`"]"
    ) | ForEach-Object { Assert-Contains "styles.css" $_ }
  }
}

function Invoke-MobileLikeChecks {
  Invoke-QuickChecks

  Step "Mobile responsive hooks" {
    Assert-Contains "index.html" "viewport-fit=cover"
    Assert-Contains "styles.css" "@media (max-width: 560px)"
    Assert-Contains "styles.css" ".today-timeline"
    Assert-Contains "styles.css" "grid-template-columns: repeat(2, minmax(0, 1fr))"
    Assert-Contains "styles.css" "overflow-wrap: anywhere"
  }
}

$script:Node = Resolve-Tool "node" "NODE_EXE"
$script:Git = Resolve-Tool "git" "GIT_EXE"

switch ($Tier) {
  "quick" { Invoke-QuickChecks }
  "docs" { Invoke-DocsChecks }
  "visual" { Invoke-VisualChecks }
  "mobile-like" { Invoke-MobileLikeChecks }
  "full" {
    Invoke-DocsChecks
    Invoke-VisualChecks
    Invoke-MobileLikeChecks
  }
}

Write-Host "OK: $Tier checks passed"

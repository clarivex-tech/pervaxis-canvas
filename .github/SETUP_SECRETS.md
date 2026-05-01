# GitHub Secrets Setup — Pervaxis Canvas

## Required Secrets

Add these at: `https://github.com/clarivex-tech/pervaxis-canvas/settings/secrets/actions`

### 1. `SONAR_TOKEN` (Required)
- Purpose: SonarCloud code analysis
- Generate at: https://sonarcloud.io/account/security
- Steps:
  1. Log in to SonarCloud
  2. Go to My Account → Security
  3. Generate token named `pervaxis-canvas`
  4. Add as GitHub secret

### 2. `NPM_TOKEN` (Required for publishing)
- Purpose: Publish packages to GitHub Packages npm registry
- Steps:
  1. Go to: https://github.com/settings/tokens/new
  2. Name: `Pervaxis Canvas - Package Publish`
  3. Scopes: `write:packages` ✓
  4. Add as GitHub secret

## Security Best Practices

- Never commit tokens to source control
- Rotate tokens every 90 days
- Use minimum required scopes
- Revoke tokens immediately if compromised

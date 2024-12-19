## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.3
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.113.6 (42 ms)
- DNS ipv6 Lookup: ::ffff:140.82.113.6 (47 ms)
- Electron Fetcher (configured): HTTP 200 (53 ms)
- Node Fetcher: HTTP 200 (120 ms)
- Helix Fetcher: HTTP 200 (204 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.21 (22 ms)
- DNS ipv6 Lookup: ::ffff:140.82.114.21 (2 ms)
- Electron Fetcher (configured): HTTP 200 (23 ms)
- Node Fetcher: HTTP 200 (116 ms)
- Helix Fetcher: HTTP 200 (125 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
export default interface AppInfo {
	webSocketPort: number;
	gitCommitId: string | null;
	gitBranchName: string | null;
	uptime: number;
	environment: string;
	nodeVersion: string;
}

import { mockUserInfo } from "../mocks/mockData";

export default function Dashboard() {
  return (
    <div>
      <h1>Bonjour {mockUserInfo.profile.firstName}</h1>
      <p>Total sessions : {mockUserInfo.statistics.totalSessions}</p>
    </div>
  );
}
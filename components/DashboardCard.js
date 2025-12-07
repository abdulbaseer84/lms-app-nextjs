export default function DashboardCard({ title, value }) {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h4 className="text-lg">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

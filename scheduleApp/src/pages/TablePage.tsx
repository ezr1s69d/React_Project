// pages/UserPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function TablePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`/api/users`).then((res) => setUser(res.data));
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
    </div>
  );
}

export default TablePage;
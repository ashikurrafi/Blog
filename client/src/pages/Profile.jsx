import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Access user from Redux store

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
    </div>
  );
};

export default Profile;

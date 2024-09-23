import { useState } from "react";
import moment from "moment";
import { IAuthUser } from "../../../types/auth.types";

interface IProps {
  usersList: IAuthUser[];
}

const LatestUsersSection = ({ usersList }: IProps) => {
  const [visibleUsersCount, setVisibleUsersCount] = useState(3); // Start by showing 3 users

  const selectedUsers = usersList.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const handleLoadMore = () => {
    setVisibleUsersCount((prevCount) => prevCount + 3); // Load 3 more users each time
  };

  return (
    <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Latest Users</h1>
      {selectedUsers.slice(0, visibleUsersCount).map((item) => (
        <div key={item.id} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-800">{item.userName}</span>
            <span className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
              {moment(item.createdAt).fromNow()}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {item.firstName} {item.lastName}
          </div>
        </div>
      ))}
      {visibleUsersCount < usersList.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestUsersSection;

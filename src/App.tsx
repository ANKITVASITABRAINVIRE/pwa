import "./App.css";
import "./App.css";
import { useQuery } from "@tanstack/react-query";

// Importing image from Google
import googleImage from "./assets/images/sunset-1373171_1280.jpg";
import googleImage1 from "./assets/images/tree-736885_1280.jpg";

import { useEffect, useState } from "react";
import { getDatabase } from "./config/DatabaseConfig";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface QueryData {
  isPending: boolean;
  error: any;
  data: Post[] | undefined;
}

function App() {
  const [posts, setPosts] = useState<Post[]>();
  const { isPending, error, data } = useQuery<QueryData>({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
  });

  useEffect(() => {
    if (data) {
      updateDatabase(data);
      getDataFromIndexdb();
    }
  }, [data]);

  const updateDatabase = async (data: any) => {
    try {
      const db = await getDatabase();
      await db.sub_admin.bulkInsert(data);
    } catch {}
  };

  const getDataFromIndexdb = async () => {
    try {
      const db = await getDatabase();
      await db["sub_admin"]
        .find()
        .exec()
        .then((res: any) => {
          if (res.length > 0) {
            const tempData: any[] = [];
            res.forEach((ele: any) => {
              tempData.push(ele._data);
            });
            setPosts(tempData);
          }
        });
    } catch {}
  };

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>An error has occurred: + {error.message}</div>;

  return (
    <div className="main-container">
      <h1 className="heading">Cache Busting</h1>
      <div className="images-static">
        <img src={googleImage} alt="Google" className="google-image" />
        <img src={googleImage1} alt="Google" className="google-image-1" />
        <img
          src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg"
          alt="Google"
          className="google-image-2"
        />
      </div>

      {Array.isArray(posts) && (
        <ul>
          {posts.map((item) => (
            <li key={item.id} className="list-item">
              {item.title}
            </li>
          ))}
        </ul>
      )}
      {/* Using IcoMoon icons */}
      <div className="icon-container">
        <span className="icon-home"></span>
        <span className="icon-pencil"></span>
      </div>
      <ul>
        {posts?.map?.((item) => (
          <li key={item.id} className="list-item">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

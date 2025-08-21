'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { use } from 'react';


export default  function Page({ params }) {

  
  const { id } =  use(params)

    const [userData, setuserData] = useState({})


    useEffect(() => {
      const fetchUserData = async () => {
        try {
          console.log("Fetching user data for ID:", id);
          const res = await fetch('/api/userprofile', {
            method: 'POST',
            headers: {
              'contentType': 'application/json',
            },
            body: JSON.stringify({id})
            })
            const data = await res.json()
            if(data){
              setuserData(data.user)
              console.log("User data fetched:", data.user);
              
            }
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      }

      fetchUserData();
    }, [id])
    
  return <>
  <div>
    <div className="w-full flex justify-center items-center px-4 h-[100vh] bg-white/5 backdrop-blur-md">
  <aside className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-6 md:p-8 flex flex-col items-center">
    <div className="w-full rounded-3xl border border-white/10 bg-[#234916]/90 p-4 sm:p-6 shadow-lg">
      
      {/* phone notch */}
      <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />
      
      {/* avatar + name */}
      <div className="flex flex-col items-center text-white text-center">
        <img
          src={
            userData?.profilePic ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23254f1a'/><circle cx='80' cy='60' r='30' fill='%23ffffff22'/><rect x='40' y='100' width='80' height='40' rx='20' fill='%23ffffff22'/></svg>"
          }
          alt="preview avatarUrl"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-white/20 shadow-md"
        />
        <h3 className="mt-3 text-base sm:text-lg font-semibold">
          {userData.name || "Your Name"}
        </h3>
        <p className="text-xs sm:text-sm text-white/70">@{userData.username || "username"}</p>
        <p className="text-xs sm:text-sm text-white/80 mt-3 px-2 sm:px-4">
          {userData.bio || "Your bio will appear here."}
        </p>
      </div>

      {/* linktree-style buttons */}
      <div className="mt-6 space-y-3">
        {userData.links && userData.links.length > 0 ? (
          userData.links.map((link) => (
            <button
              key={link._id || link.url}
              className="w-full h-10 sm:h-11 rounded-full bg-white text-[#254f1a] text-sm sm:text-base font-semibold hover:bg-white/90 transition shadow-md"
              onClick={() => window.open(link.url, "_blank")}
            >
              {link.name}
            </button>
          ))
        ) : (
          <p className="text-white/60 text-center text-sm">No links added yet.</p>
        )}
      </div>
    </div>

  </aside>
</div>
  </div>
  </>
}
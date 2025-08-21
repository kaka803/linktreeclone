'use client'
import React, { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { LayoutDashboard, Menu, Link2, BarChart3, X } from "lucide-react";
import { useRouter } from 'next/navigation';




const Page = () => {
  const [User, setUser] = useState({})
  const [activePage, setactivePage] = useState('profile')
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false)
  const [linksLoading, setLinksLoading] = useState(true);
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const { user } = useUser();
  const [profileData, setprofileData] = useState({});
  const [originalProfile, setOriginalProfile] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [editData, setEditData] = useState({ name: "", url: "" });
  const [updateloading, setupdateloading] = useState(false)
  const [open, setOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setUser(user)

    if (user) {
      fetch('/api/getlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.emailAddresses[0].emailAddress }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.links && Array.isArray(data.links)) {
            setprofileData(data.userData);   // editable
            setOriginalProfile(data.userData); // original (reference ke liye)
            setLinks(data.links);
            setLinksLoading(false);
          } else {
            console.error("Invalid links data:", data.links);
          }
          setLinksLoading(false);
        })
        .catch(err => {
          console.error("Error fetching links:", err);
          setLinksLoading(false);
        });
    }
  }, [user])



  const handleAddLink = async () => {
    if (newLink.name && newLink.url) {
      setLoading(true);
      const res = await fetch('/api/addlink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newLink.name,
          url: newLink.url,
          email: user.emailAddresses[0].emailAddress,
        }),
      });

      const data = await res.json();
      setShowForm(false);
      setLoading(false);

      if (data.message) {


        if (!Array.isArray(data.links)) {
          setLinks((prevLinks) => [
            {
              _id: data.links._id || Date.now().toString(),
              name: data.links.name,
              url: data.links.url,
            },
            ...prevLinks,
          ]);
        } else {

          setLinks(data.links.reverse());
        }

        setNewLink({ name: '', url: '' });
      }

    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setprofileData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const hasChanged =
      profileData.name !== originalProfile.name ||
      profileData.username !== originalProfile.username ||
      profileData.email !== originalProfile.email ||
      profileData.bio !== originalProfile.bio

    setIsChanged(hasChanged);
  }, [profileData, originalProfile]);


  useEffect(() => {
    if (user?.imageUrl) {

      fetch("/api/updateProfilePic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          imageUrl: user.imageUrl,
        }),
      });
    }
  }, [user?.imageUrl, user?.primaryEmailAddress?.emailAddress]);




  const handleUpdateLink = async (id) => {
    try {
      setupdateloading(true);
      const res = await fetch(`/api/updateLink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updatedLink: editData,
          email: user.emailAddresses[0].emailAddress,
          linkId: id,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLinks((prev) =>
          prev.map((link) => (link._id === id ? updated : link))
        );
        setEditingLink(null);
      }
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setupdateloading(false);
    }
  };

  const updateProfile = async () => {


    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.emailAddresses[0].emailAddress,
        name: profileData.name,
        username: profileData.username,
        bio: profileData.bio,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setOriginalProfile(profileData);
      setIsChanged(false);
    } else {
      const errorData = await res.json();
      console.error("Error updating profile:", errorData);
    }

  }

  const handleDeleteLink = async (id) => {
    try {
      setDeletingId(id); // jis button pe click hua uska id set karo

      const res = await fetch("/api/deletelink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.emailAddresses[0].emailAddress,
          linkId: id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLinks((prevLinks) => prevLinks.filter((link) => link._id !== id));
        console.log(data.message);
      } else {
        console.error("Failed:", data.message);
      }

    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setDeletingId(null); // hamesha reset ho jaye
    }
  };



  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen ]'>
        loading...
      </div>
    )
  }

  return (
    <>
      <div className="bg-[#254f1a] min-h-screen">
        {/* Navbar */}
        <div className="max-w-[90%] m-auto bg-white h-16 my-5 rounded-2xl shadow-md flex items-center justify-between px-5">
          {/* Logo */}
          <img src="full-logo.svg" alt="logo" width="100" className='hidden md:block' />
          <img src="logo.svg" alt="logo" width="30" className='md:hidden block' />

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                router.push(`/userprofile/${profileData._id}`);
              }}
              className="bg-[#254f1a] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#1d3f14] transition 
                   md:px-4 md:py-2 md:rounded-xl md:text-sm">
              Live Preview
            </button>

            {/* Copy Link Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}userprofile/${profileData._id}`
                );
                alert("Link copied!");
              }}
              className="flex items-center gap-1.5 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition 
             md:gap-2  md:rounded-xl md:text-sm"
            >
              <Link2 size={14} />
              Copy Link
            </button>


            {/* Mobile Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition text-black"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>


        {/* Mobile Sidebar + Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)} // overlay click closes menu
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-3/4 sm:w-1/2 bg-white rounded-r-2xl shadow-lg z-50 transform transition-transform duration-300 ease-in-out 
      ${open ? "translate-x-0" : "-translate-x-[200%]"}`}
        >
          <aside className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#254f1a]">
                {`Welcome ${User?.firstName}`}
              </h1>
              <button onClick={() => setOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 p-4">
              <ul className="space-y-3">
                <li
                  onClick={() => {
                    setactivePage("profile");
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition"
                >
                  <LayoutDashboard size={20} />
                  Profile
                </li>

                <li
                  onClick={() => {
                    setactivePage("links");
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition"
                >
                  <Link2 size={20} />
                  Links
                </li>



                <li
                  onClick={() => {
                    setactivePage("livepreview");
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition">

                  <BarChart3 size={20} />
                  Live Preview
                </li>
                
              </ul>
            </nav>
          </aside>
        </div>

        {/* Main Content */}
        <div className="max-w-[90%] m-auto flex flex-col lg:flex-row gap-5 mt-6">
          {/* Left Sidebar (Desktop Only) */}
          <div className="hidden md:block lg:w-1/3">
            <aside className="bg-white rounded-xl shadow-lg h-full flex flex-col">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-[#254f1a]">{`Welcome ${User?.firstName}`}</h1>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-3">
                  <li
                    onClick={() => setactivePage("profile")}
                    className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition"
                  >
                    <LayoutDashboard size={20} />
                    Profile
                  </li>
                  <li
                    onClick={() => setactivePage("links")}
                    className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition"
                  >
                    <Link2 size={20} />
                    Links
                  </li>
                  <li
                    onClick={() => {
                      setactivePage("livepreview");
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 text-gray-600 cursor-pointer hover:text-[#254f1a] hover:bg-green-50 rounded-lg px-3 py-2 transition">

                    <BarChart3 size={20} />
                    Live Preview
                  </li>
                  
                </ul>
              </nav>
            </aside>
          </div>

          {/* Page Content */}
          <div className="bg-white w-full rounded-xl p-6 shadow-md">
            {activePage === "profile" && (
              <div className="p-6 bg-white rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-[#254f1a]">Your Profile</h2>

                <section className="mt-6 space-y-6">

                  <div>
                    <label className="block text-sm mb-2 text-gray-800">Profile Picture</label>
                    <UserButton
                      user={User}
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-20 h-20 rounded-full",
                        },
                      }}
                    />
                    <p className="text-xs mt-2 text-gray-600">
                      Click on the avatar to change your profile picture.
                    </p>
                  </div>


                  <div>
                    <label className="block text-sm mb-2 text-gray-800">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name || ""}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-gray-100 border border-gray-300 focus:border-[#254f1a] outline-none px-4 h-12 text-gray-800"
                    />
                  </div>


                  <div>
                    <label className="block text-sm mb-2 text-gray-800">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-gray-100 border border-gray-300 focus:border-[#254f1a] outline-none px-4 h-12 text-gray-800"
                    />
                  </div>


                  <div>
                    <label className="block text-sm mb-2 text-gray-800">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      placeholder="Write something about yourself..."
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 text-gray-700 px-4 py-3 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs mt-2 text-gray-600">
                      This will be shown on your public profile. Keep it short and sweet.
                    </p>
                  </div>


                  {/* Update Button */}
                  <button
                    disabled={!isChanged}
                    onClick={updateProfile}
                    className={`w-full h-12 rounded-xl font-semibold transition ${isChanged
                        ? "bg-[#254f1a] hover:bg-[#1b3a12] text-white"
                        : "bg-gray-400 cursor-not-allowed text-gray-200"
                      }`}
                  >
                    Update Profile
                  </button>
                </section>
              </div>
            )}
            {activePage === "links" && (
              <div className="bg-white w-full rounded-xl">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#254f1a]">Your Links</h2>

                  <div className="mt-4 space-y-3">
                    {links && links.length > 0 ? (
                      links.map((link) => (
                        <div
                          key={link._id || link.url}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >

                          {editingLink === link._id ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData({ ...editData, name: e.target.value })
                                }
                                className="w-full border text-black px-3 py-2 rounded-lg"
                              />
                              <input
                                type="url"
                                value={editData.url}
                                onChange={(e) =>
                                  setEditData({ ...editData, url: e.target.value })
                                }
                                className="w-full border text-black px-3 py-2 rounded-lg"
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleUpdateLink(link._id)}
                                  className="px-3 py-1 bg-[#254f1a] text-white rounded-lg hover:bg-[#1d3f14]"
                                >
                                  {updateloading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingLink(null)}
                                  className="px-3 py-1 border text-black rounded-lg hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Normal view
                            <>
                              <div>
                                <p className="font-semibold text-gray-800">{link.name}</p>
                                <p className="text-sm text-gray-500 w-[150px]  md:w-[350px] overflow-hidden ">{link.url}</p>
                              </div>
                              <div className="flex items-center gap-2 justify-center">
                                <button
                                  onClick={() => {
                                    setEditingLink(link._id);
                                    setEditData({ name: link.name, url: link.url });
                                  }}
                                  className="px-3 py-1 text-sm bg-[#254f1a] text-white rounded-lg hover:bg-[#1d3f14]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link._id)}
                                  className="px-3 py-1 text-sm bg-[#254f1a] text-white rounded-lg hover:bg-[#1d3f14]"
                                >
                                  {deletingId === link._id ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No links added yet.</div>
                    )}

                    {/* Add New Link Button */}
                    {!showForm && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full px-4 py-2 bg-[#254f1a] text-white rounded-lg hover:bg-[#1d3f14]"
                      >
                        + Add New Link
                      </button>
                    )}

                    {/* Add Link Form */}
                    {showForm && (
                      <div className="p-4 border rounded-lg space-y-3">
                        <input
                          type="text"
                          placeholder="Enter link name"
                          value={newLink.name}
                          onChange={(e) =>
                            setNewLink({ ...newLink, name: e.target.value })
                          }
                          className="w-full border text-black placeholder:text-gray-500 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254f1a]"
                        />
                        <input
                          type="url"
                          placeholder="Enter link URL"
                          value={newLink.url}
                          onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                          }
                          className="w-full border text-black placeholder:text-gray-500 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254f1a]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleAddLink}
                            className="flex-1 px-4 py-2 bg-[#254f1a] text-white rounded-lg hover:bg-[#1d3f14]"
                          >
                            {loading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-4 py-2 border text-black rounded-lg hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {activePage === "livepreview" && (
              <div className="w-full flex justify-center px-4 py-6">
                <aside className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-5 flex flex-col items-center shadow-xl">
                  <div className="w-full rounded-[2rem] border border-white/10 bg-[#234916]/95 p-6 shadow-lg flex flex-col">

                    {/* phone notch */}
                    <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-white/20" />

                    {/* avatar + name */}
                    <div className="flex flex-col items-center text-white text-center">
                      <img
                        src={
                          user?.imageUrl ||
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23254f1a'/><circle cx='80' cy='60' r='30' fill='%23ffffff22'/><rect x='40' y='100' width='80' height='40' rx='20' fill='%23ffffff22'/></svg>"
                        }
                        alt="preview avatarUrl"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/30 shadow-md"
                      />
                      <h3 className="mt-3 text-lg sm:text-xl font-semibold tracking-wide">
                        {profileData.name || "Your Name"}
                      </h3>
                      <p className="text-sm text-white/70">@{profileData.username || "username"}</p>
                      <p className="text-sm text-white/80 mt-3 px-3 leading-relaxed">
                        {profileData.bio || "Your bio will appear here. Keep it short and sweet."}
                      </p>
                    </div>

                    {/* linktree-style buttons */}
                    <div className="mt-8 space-y-4 flex flex-col">
                      {links && links.length > 0 ? (
                        links.map((link) => (
                          <button
                            key={link._id || link.url}
                            className="w-full h-12 rounded-full bg-white text-[#254f1a] text-base font-semibold hover:bg-white/90 active:scale-95 transition shadow-lg"
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

                  <p className="text-[11px] sm:text-xs text-white/60 mt-5">Live Preview (UI only)</p>
                </aside>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}

export default Page

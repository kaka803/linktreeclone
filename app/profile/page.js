"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user } = useUser();

  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("Web developer • Designer • Coffee ☕");

  useEffect(() => {
    setName(user?.fullName || "");
    setEmail(user?.emailAddresses[0]?.emailAddress || "");
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          bio,
          avatarUrl: user.imageUrl,
        }),
      });

      const data = await res.json();
      if (data) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  // check agar fields empty hain
  const isDisabled = !name.trim() || !username.trim() || !bio.trim() || loading;

  return (
    <div className="min-h-dvh bg-[#254f1a] text-white">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mx-4 font-linksans tracking-wide">
          Profile Setup
        </h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12 grid md:grid-cols-2 gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8">
          <h2 className="text-base font-medium mb-5">Public Profile</h2>

          {/* name */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-white/80">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-2xl bg-white/10 border border-white/15 focus:border-white/30 outline-none px-4 h-12 placeholder:text-white/50"
            />
          </div>

          {/* username */}
          <div className="mb-5">
            <label className="block text-sm mb-2 text-white/80">Username</label>
            <div className="flex items-center rounded-2xl bg-white/10 border border-white/15 focus-within:border-white/30">
              <span className="px-3 text-white/60 select-none">@</span>
              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/\s/g, ""))
                }
                placeholder="username"
                className="w-full bg-transparent outline-none px-1 h-12 placeholder:text-white/50"
              />
            </div>
            <p className="text-xs mt-2 text-white/60">
              Your profile URL: linktr.ee/{username || "username"}
            </p>
          </div>

          {/* bio */}
          <div className="mb-8">
            <label className="block text-sm mb-2 text-white/80">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people who you are…"
              rows={4}
              className="w-full rounded-2xl bg-white/10 border border-white/15 focus:border-white/30 outline-none px-4 py-3 placeholder:text-white/50 resize-none"
            />
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>Tip: keep it short & sweet.</span>
              <span>{bio.length}/160</span>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className="h-11 px-5 rounded-2xl bg-white text-[#254f1a] font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </section>

        {/* right: live preview */}
        <aside className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8 flex flex-col items-center">
          <div className="w-[320px] max-w-full rounded-3xl border border-white/10 bg-[#234916] p-6">
            {/* phone notch */}
            <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-white/20" />
            {/* avatar + name */}
            <div className="flex flex-col items-center">
              <img
                src={
                  avatarUrl ??
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23254f1a'/><circle cx='80' cy='60' r='30' fill='%23ffffff22'/><rect x='40' y='100' width='80' height='40' rx='20' fill='%23ffffff22'/></svg>"
                }
                alt="preview avatarUrl"
                className="w-20 h-20 rounded-full object-cover border border-white/15"
              />
              <h3 className="mt-3 text-base font-semibold">
                {name || "Your Name"}
              </h3>
              <p className="text-sm text-white/70">@{username || "username"}</p>
              <p className="text-center text-sm text-white/80 mt-3">
                {bio || "Your bio will appear here."}
              </p>
            </div>

            {/* linktree-style buttons (demo) */}
            <div className="mt-6 space-y-3">
              <button className="w-full h-11 rounded-full bg-white text-[#254f1a] font-semibold">
                Primary Link
              </button>
              <button className="w-full h-11 rounded-full border border-white/30 bg-transparent text-white">
                Secondary Link
              </button>
              <button className="w-full h-11 rounded-full border border-white/30 bg-transparent text-white">
                Another Link
              </button>
            </div>
          </div>
          <p className="text-xs text-white/60 mt-4">Live Preview (UI only)</p>
        </aside>
      </main>
    </div>
  );
}

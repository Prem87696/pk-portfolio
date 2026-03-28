import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, LogOut } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
  created_at?: string;
}

interface Profile {
  full_name: string;
  email: string;
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading]);

  // 🔹 Load data
  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchProfile();
    }
  }, [user]);

  // 🔹 Fetch profile
  const fetchProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

    setProfile(data);
  };

  // 🔹 Fetch projects
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (currentProject.id) {
        await supabase
          .from('projects')
          .update(currentProject)
          .eq('id', currentProject.id);
      } else {
        await supabase.from('projects').insert([
          {
            ...currentProject,
            user_id: user.id,
          },
        ]);
      }

      toast.success('Saved successfully');
      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🔹 Delete
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;

    await supabase.from('projects').delete().eq('id', id);
    toast.success('Deleted');
    fetchProjects();
  };

  // 🔹 Logout
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400">
            Welcome {profile?.full_name || user.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          setCurrentProject({});
          setIsEditing(true);
        }}
        className="mb-6 flex items-center gap-2 bg-white text-black px-4 py-2 rounded"
      >
        <Plus size={16} />
        New Project
      </button>

      {/* FORM */}
      {isEditing && (
        <form onSubmit={handleSaveProject} className="space-y-3 mb-8">
          <input
            placeholder="Title"
            required
            value={currentProject.title || ''}
            onChange={(e) =>
              setCurrentProject({ ...currentProject, title: e.target.value })
            }
            className="w-full p-2 bg-zinc-900 border"
          />

          <input
            placeholder="URL"
            value={currentProject.url || ''}
            onChange={(e) =>
              setCurrentProject({ ...currentProject, url: e.target.value })
            }
            className="w-full p-2 bg-zinc-900 border"
          />

          <button className="bg-green-500 px-4 py-2 rounded">
            Save
          </button>
        </form>
      )}

      {/* PROJECT LIST */}
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            className="flex justify-between bg-zinc-900 p-4 mb-2 rounded"
          >
            <div>
              <h2>{p.title}</h2>
              <p className="text-sm text-zinc-400">{p.url}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCurrentProject(p);
                  setIsEditing(true);
                }}
              >
                <Edit2 size={16} />
              </button>

              <button onClick={() => handleDeleteProject(p.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

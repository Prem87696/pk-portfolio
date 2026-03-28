import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

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
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (currentProject.id) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update({
            title: currentProject.title,
            description: currentProject.description,
            url: currentProject.url,
            image_url: currentProject.image_url,
          })
          .eq('id', currentProject.id)
          .eq('user_id', user.id);

        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert([
            {
              user_id: user.id,
              title: currentProject.title,
              description: currentProject.description,
              url: currentProject.url,
              image_url: currentProject.image_url,
            },
          ]);

        if (error) throw error;
        toast.success('Project created successfully');
      }

      setIsEditing(false);
      setCurrentProject({});
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(error.message || 'Failed to delete project');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-white"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
            Manage your portfolio projects.
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentProject({});
            setIsEditing(true);
          }}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {isEditing ? (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {currentProject.id ? 'Edit Project' : 'Create New Project'}
          </h2>
          <form onSubmit={handleSaveProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                required
                value={currentProject.title || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                value={currentProject.description || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project URL</label>
              <input
                type="url"
                value={currentProject.url || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, url: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={currentProject.image_url || ''}
                onChange={(e) => setCurrentProject({ ...currentProject, image_url: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
              >
                Save Project
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white px-4 py-2 rounded-md font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Project</th>
                <th className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">URL</th>
                <th className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400">Created</th>
                <th className="px-6 py-3 font-medium text-zinc-500 dark:text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No projects found. Create your first one!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{project.title}</td>
                    <td className="px-6 py-4">
                      {project.url ? (
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400 truncate max-w-[200px] inline-block">
                          {project.url}
                        </a>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {/* Assuming created_at exists, though not in interface, it's standard */}
                      {new Date((project as any).created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentProject(project);
                            setIsEditing(true);
                          }}
                          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                          aria-label="Edit project"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          aria-label="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

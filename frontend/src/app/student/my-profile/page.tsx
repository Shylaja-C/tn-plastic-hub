'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError, usersApi, userStore } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function StudentMyProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: user?.full_name ?? '', phone: user?.phone ?? '', college_name: user?.college_name ?? '', department: user?.department ?? '', bio: user?.bio ?? '', skills: user?.skills ?? '', linkedin_url: user?.linkedin_url ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const saveProfile = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      const updated = await usersApi.updateMe(form);
      userStore.set(updated);
      setSuccess('Profile updated!'); setEditing(false);
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to update profile.'); }
    finally { setSaving(false); }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault(); setPwSaving(true); setPwError(''); setPwSuccess('');
    try {
      await usersApi.changePassword(pwForm);
      setPwSuccess('Password changed!'); setPwForm({ current_password: '', new_password: '' });
    } catch (err) { setPwError(err instanceof ApiError ? err.message : 'Failed to change password.'); }
    finally { setPwSaving(false); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!editing ? <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button> : <div className="flex gap-2"><Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={saveProfile} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button></div>}
      </div>
      {success && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />{success}</p>}
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {editing ? (
            <>
              <div><label className="text-sm font-medium">Full Name</label><Input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
              <div><label className="text-sm font-medium">College</label><Input value={form.college_name} onChange={(e) => set('college_name', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Department</label><Input value={form.department} onChange={(e) => set('department', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Skills</label><Input value={form.skills} onChange={(e) => set('skills', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Bio</label><textarea className="w-full min-h-[60px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.bio} onChange={(e) => set('bio', e.target.value)} /></div>
              <div><label className="text-sm font-medium">LinkedIn</label><Input value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} /></div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </>
          ) : (
            <div className="grid gap-2 text-sm">
              {[['Name', user.full_name], ['Email', user.email], ['Phone', user.phone], ['College', user.college_name], ['Department', user.department], ['Skills', user.skills], ['Bio', user.bio], ['LinkedIn', user.linkedin_url]].map(([label, val]) => val ? <div key={label}><span className="font-medium">{label}:</span> <span className="text-muted-foreground">{val}</span></div> : null)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={changePw} className="space-y-3 max-w-sm">
            <div><label className="text-sm font-medium">Current Password</label><Input type="password" required value={pwForm.current_password} onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })} /></div>
            <div><label className="text-sm font-medium">New Password</label><Input type="password" required minLength={6} value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} /></div>
            {pwError && <p className="text-sm text-red-500">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
            <Button type="submit" disabled={pwSaving}>{pwSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

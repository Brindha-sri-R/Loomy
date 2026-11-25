import { Package, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AccountPage() {
  const { user, orders, signOut, updateProfile, showToast } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    await updateProfile({ name: name.trim() });
    setSaving(false);
    showToast('Profile updated');
  };

  return (
    <section className="animate-page-enter relative min-h-[80vh] bg-[#F2F3F7]/75 py-14 backdrop-blur-[1px]">
      <div className="mx-auto max-w-4xl px-5 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-black/15 pb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-[#7C8BFF] uppercase">
              PROTECTED ACCOUNT
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111111]">
              Welcome, {user.name}
            </h1>
          </div>

          {confirmOut ? (
            <div className="flex items-center gap-2 rounded-full border border-[#E11D48]/25 bg-white p-1.5">
              <button
                type="button"
                onClick={signOut}
                className="rounded-full bg-[#E11D48] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Confirm Sign Out
              </button>
              <button
                type="button"
                onClick={() => setConfirmOut(false)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#6E6E73]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmOut(true)}
              className="rounded-full bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#E11D48]"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <form
            onSubmit={handleSave}
            className="rounded-2xl border border-black/[0.06] bg-white p-6 md:col-span-5"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[#7C8BFF]" />
              <h2 className="text-base font-bold">Profile Details</h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#6E6E73]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 px-3.5 py-2 text-sm outline-none focus:border-[#7C8BFF]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#6E6E73]">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-[#F4F4F6] px-3.5 py-2 text-sm text-[#6E6E73]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full bg-[#111111] py-2.5 text-xs font-semibold text-white hover:bg-[#7C8BFF] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 md:col-span-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#7C8BFF]" />
                <h2 className="text-base font-bold">Order History</h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E6E73]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Session
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="mt-8 text-center">
                <p className="text-sm text-[#6E6E73]">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block rounded-full bg-[#111111] px-5 py-2 text-xs font-semibold text-white"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord._id || ord.id}
                    className="flex items-center justify-between rounded-xl bg-[#F6F6F8] p-4"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#111111]">
                        Order #{String(ord._id || ord.id).slice(-6).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6E6E73]">
                        {ord.items?.length || 1} item(s) · {ord.status || 'Confirmed'}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-[#111111]">
                      ${Number(ord.totalAmount || ord.total || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

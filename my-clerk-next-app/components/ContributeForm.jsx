"use client";

import { useRef, useState } from "react";
import { fetchJson } from "@/lib/api";

const MAX_BODY = 10000;
const MAX_IMAGES = 5;

// Yesterday, as YYYY-MM-DD — the latest allowed memory date (today is "now").
function yesterdayISO() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function ContributeForm({ placeId, placeName, onClose, onCreated }) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef(null);

  const max = yesterdayISO();

  function onPickFiles(e) {
    const picked = Array.from(e.target.files || []);
    const combined = [...files, ...picked].slice(0, MAX_IMAGES);
    setFiles(combined);
    if (fileInput.current) fileInput.current.value = "";
  }

  function removeFile(i) {
    setFiles((f) => f.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!date) return setError("Pick the date this memory is from.");
    if (!body.trim() && files.length === 0)
      return setError("Add some text or at least one image.");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("placeId", placeId);
      fd.set("memoryDate", date);
      fd.set("title", title);
      fd.set("body", body);
      files.forEach((f) => fd.append("images", f));

      const data = await fetchJson("/api/contributions", { method: "POST", body: fd });
      onCreated(data.contribution);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4">
      <div className="thin-scroll max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-black/5 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Add a memory</h3>
            <p className="text-xs text-zinc-500">
              What did <span className="font-medium">{placeName}</span> used to be?
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-black/5 hover:text-zinc-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Date of this memory
            </label>
            <input
              type="date"
              value={date}
              max={max}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-[11px] text-zinc-400">
              Must be in the past — the present is reserved for what&apos;s here now.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              What was it? <span className="font-normal text-zinc-400">(optional title)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tower Records"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Your memory
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY))}
              rows={5}
              placeholder="Describe what this place used to be, or a memory you have of it…"
              className="w-full resize-y rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-1 text-right text-[11px] text-zinc-400">
              {body.length.toLocaleString()} / {MAX_BODY.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-700">
              Photos <span className="font-normal text-zinc-400">(up to {MAX_IMAGES})</span>
            </label>
            {files.length > 0 && (
              <div className="mb-2 grid grid-cols-3 gap-2">
                {files.map((f, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-zinc-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length < MAX_IMAGES && (
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                onChange={onPickFiles}
                className="block w-full text-xs text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post memory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

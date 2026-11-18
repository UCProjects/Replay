const blobs = new Map<string, Promise<Blob>>();

function blobOf(name: string): Promise<Blob> {
  const cached = blobs.get(name);
  if (cached) return cached;
  const blob = fetch(`/images/vfx/${name}.png`).then((response) => {
    if (!response.ok) throw new Error(`${name} ${response.status}`);
    return response.blob();
  });
  blob.catch(() => blobs.delete(name));
  blobs.set(name, blob);
  return blob;
}

export async function freshImageUrl(name: string): Promise<string> {
  return URL.createObjectURL(await blobOf(name));
}

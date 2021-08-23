import { useState } from 'react';

const Index = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');
  const [imgUrl, setImgUrl] = useState<string>('');

  async function submit() {
    setLoading(true);
    setIsSubmitting(true);
    const res = await fetch('/api/getImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    });
    const json = await res.json();
    setImgUrl(json.data);
    setLoading(false);
    setIsSubmitting(false);
  }

  return (
    <div>
      {loading && <h1>loading...</h1>}
      <div>
        {imgUrl.length > 0 ? (
          <img
            key={imgUrl}
            src={imgUrl}
            width={1280}
            height={720}
            alt={imgUrl}
          />
        ) : null}
        <input
          type="text"
          placeholder="enter a website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={submit} type="submit" disabled={isSubmitting}>
          Submit URL
        </button>
      </div>
    </div>
  );
};
export default Index;

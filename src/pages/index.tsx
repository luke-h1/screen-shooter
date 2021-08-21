/* eslint-disable no-console */
import { useState } from 'react';

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  async function submit() {
    setLoading(true);
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
        <button onClick={submit} type="submit">
          Submit URL
        </button>
      </div>
    </div>
  );
};
export default Index;

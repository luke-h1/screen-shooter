import { InputField } from '@src/components/InputField';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import axios from 'axios';
import { Spinner } from '@src/components/Spinner';
import { CustomHead } from '@src/components/CustomHead';

interface FormValues {
  website: string;
}

const Index = () => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  /*
            {loading && <Spinner />}
          <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
            {!loading && imgUrl.length > 0 ? (
              <img
                style={{ objectFit: 'cover', maxWidth: '100%' }}
                src={imgUrl}
                alt={imgUrl}
              />
            ) : null}
          </div>

  */
  return (
    <>
      <CustomHead
        description="Homepage | screenshot an image"
        title="Home | screen-snapshot"
      />
      <section className="text-gray-600 body-font relative">
        <div className="container px-3 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="flex flex-col align-center">
            <Formik<FormValues>
              initialValues={{ website: '' }}
              onSubmit={async (values) => {
                setLoading(true);
                const res = await axios.post(
                  '/api/getImage',
                  { url: values.website },
                  { headers: { 'Content-Type': 'application/json' } },
                );
                setImgUrl(res.data.url);
                setLoading(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="relative mb-4">
                    <InputField
                      name="website"
                      placeholder="website URL"
                      label="website"
                      data-testid="website"
                    />
                  </div>
                  <button
                    className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <h2 className="text-gray-900 text-lg font-medium title-font mb-4">
              Get a screenshot of the website you enter
            </h2>
            {loading && <Spinner />}
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              {!loading && imgUrl.length > 0 ? (
                <img
                  style={{ objectFit: 'cover', maxWidth: '100%' }}
                  src={imgUrl}
                  alt={imgUrl}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Index;

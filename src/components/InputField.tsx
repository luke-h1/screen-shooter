/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export const InputField: React.FC<Props> = ({ label, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <div className="max-w-lg w-full">
      <label
        className="block text-gray-500 font-bold text-left mb-3 md:mb-0 pr-4"
        htmlFor={field.name}
      >
        {label}
      </label>
      <input
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        {...field}
        {...props}
        id={field.name}
      />
      {error && (
        <div role="alert">
          <div
            className="bg-red-500 text-white font-bold rounded-t px-4 py-2"
            data-testid="auth-error"
          >
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

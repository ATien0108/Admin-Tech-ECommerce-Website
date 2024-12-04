import React from "react";

const CustomInput = ({
  type,
  label,
  id,
  className,
  name,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div className="form-floating mt-3">
      <input
        type={type}
        className={`form-control ${className || ""}`}
        id={id}
        name={name} // Ensure 'name' is passed for Formik
        value={value} // Bind the value from Formik's state
        onChange={onChange} // Use Formik's handleChange directly
        onBlur={onBlur} // Use Formik's handleBlur directly
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default CustomInput;

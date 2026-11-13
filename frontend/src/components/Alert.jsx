import React from "react";

export default function Alert({ children, tone = "error" }) {
  return <div className={`alert ${tone}`} role="alert">{children}</div>;
}

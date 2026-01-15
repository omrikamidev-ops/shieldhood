import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0B1F33",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
        }}
      >
        HC
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  );
}

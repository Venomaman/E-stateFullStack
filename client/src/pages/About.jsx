import React from "react";
import Footer from "../component/Footer";

export default function About() {
  return (
    <div>
      <div className="py-16 px-4 max-w-6xl mx-auto pb-16">
        <h1 className="text-3xl font-semibold mb-4 text-slate-800">
          About <span className="text-slate-400">Dream HSE</span>
        </h1>
        <p className="mb-4 text-slate-700 font-mono">
          Dream Hse in a tranquil this one-of-a-kind gem awaits you.
          Immaculately maintained and move-in ready, this property boasts modern
          amenities and stunning panoramic views. Picture yourself enjoying
          alfresco dining on the wraparound balcony or relaxing by the infinity
          pool.this residence combines luxury and practicality.
        </p>
        <p className="mb-4 text-slate-500 font-mono">
          The spacious living area seamlessly connects to the gourmet kitchen,
          Equipped with top-of-the-line stainless steel appliances, granite
          countertops, and a large island, this kitchen is a culinary haven. The
          luxurious master bedroom features a walk-in closet, en-suite bathroom,
          and a private balcony with sunrise views. Additionally, there’s a
          dedicated home office with ample natural light, ensuring productivity.
        </p>
        <p className="mb-4 text-slate-700 font-mono">
          Buying, selling, or building—it’s all transparent. We break down the
          process step by step, demystifying real estate complexities. From
          initial interaction to closing signatures, you’re informed and
          empowered.Our success stories are more than numbers—they’re personal
          connections. Meet the 426 clients who found their dream homes through
          us.
        </p>
      </div>
      <div className="absolute w-full sm:bottom-0">
        <Footer />
      </div>
    </div>
  );
}

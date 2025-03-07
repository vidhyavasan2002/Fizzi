"use client";

import { Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Center, Environment, View } from "@react-three/drei";
import { JSX, useRef, useState } from "react";
import clsx from "clsx";
import { Group } from "three";
import gsap from "gsap";

import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { ArrowIcon } from "./ArrowIcon";
import { WavyCircles } from "./WavyCircles";

const SPINS_ON_CHANGE = 8;
const FLAVORS: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
}[] = [
  { flavor: "blackCherry", color: "#710523", name: "Black Cherry" },
  { flavor: "grape", color: "#572981", name: "Grape Goodness" },
  { flavor: "lemonLime", color: "#164405", name: "Lemon Lime" },
  {
    flavor: "strawberryLemonade",
    color: "#690B3D",
    name: "Strawberry Lemonade",
  },
  { flavor: "watermelon", color: "#4B7002", name: "Watermelon Crush" },
];

/**
 * Props for `Carousel`.
 */
export type CarouselProps = SliceComponentProps<Content.CarouselSlice>;

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({ slice }: CarouselProps): JSX.Element => {
  const [currentFlavorIndex, setCurrentFlavorIndex] = useState(0);
  const sodaCanRef = useRef<Group>(null);

  function changeFlavor(index: number) {
    if (!sodaCanRef.current) return;

    const nextIndex = (index + FLAVORS.length) % FLAVORS.length;

    const tl = gsap.timeline();

    tl.to(
      sodaCanRef.current.rotation,
      {
        y:
          index > currentFlavorIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: "power2.inOut",
        duration: 1,
      },
      0
    )
      .to(
        ".background",
        {
          backgroundColor: FLAVORS[nextIndex].color,
          ease: "power2.inOut",
          duration: 1,
        },
        0
      )
      .to(
        ".wavyCircles",
        {
          color: FLAVORS[nextIndex].color, // 🛠 Wave color now changes dynamically!
          ease: "power2.inOut",
          duration: 1,
        },
        0
      )
      .to(".text-wrapper", { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentFlavorIndex(nextIndex) }, 0.5)
      .to(".text-wrapper", { duration: 0.2, y: 0, opacity: 1, zIndex: 20 }, 0.7);
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="carousel relative grid h-screen grid-rows-[auto,4fr,auto] justify-center overflow-hidden bg-white py-12 text-white text-center"
    >
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" />

      {/* 🛠 Wave color dynamically changes */}
      <WavyCircles
        className="wavyCircles absolute left-1/2 top-1/2 z-10 h-[150vmin] -translate-x-1/2 -translate-y-1/2"
        style={{ color: FLAVORS[currentFlavorIndex].color }}
      />

      <h2 className="relative z-20 text-5xl font-bold mx-auto max-w-[90%] sm:max-w-[70%]">
        <PrismicText field={slice.primary.heading} />
      </h2>

      {/* Arrows & Can Wrapper */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center w-full">
        {/* Left Arrow */}
        <div className="flex justify-center">
          <ArrowButton
            onClick={() => changeFlavor(currentFlavorIndex - 1)}
            direction="left"
            label="Previous Flavor"
          />
        </div>

        {/* Can */}
        <div className="flex justify-center">
          <View className="aspect-square h-[70vmin] min-h-40">
            <Center position={[0, 0, 1.5]}>
              <FloatingCan
                ref={sodaCanRef}
                floatIntensity={0.3}
                rotationIntensity={1}
                flavor={FLAVORS[currentFlavorIndex].flavor}
              />
            </Center>
            <Environment
              files="/hdr/lobby.hdr"
              environmentIntensity={0.6}
              environmentRotation={[0, 3, 0]}
            />
            <directionalLight intensity={6} position={[0, 1, 1]} />
          </View>
        </div>

        {/* Right Arrow */}
        <div className="flex justify-center">
          <ArrowButton
            onClick={() => changeFlavor(currentFlavorIndex + 1)}
            direction="right"
            label="Next Flavor"
          />
        </div>
      </div>

      {/* Text Below Can */}
      <div className="text-area relative mx-auto text-center -mt-5 pb-2 z-20">
        <div className="text-wrapper text-4xl font-medium">
          <p className="whitespace-normal">{FLAVORS[currentFlavorIndex].name}</p>
        </div>
        <div className="mt-2 text-2xl font-normal opacity-90">
          <PrismicRichText field={slice.primary.price_copy} />
        </div>
      </div>
    </section>
  );
};

export default Carousel;

/** Arrow Button Component */
type ArrowButtonProps = {
  direction?: "right" | "left";
  label: string;
  onClick: () => void;
};

function ArrowButton({
  label,
  onClick,
  direction = "right",
}: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20 z-30"
    >
      <ArrowIcon className={clsx(direction === "right" && "-scale-x-100")} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

import { useState, useRef, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export interface Testimonial {
  img?: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [autorotate, setAutorotate] = useState(true);
  const autorotateTiming = 7000;
  const total = testimonials.length;
  const current = testimonials[active];

  const goTo = (index: number) => {
    setActive((index + total) % total);
    setAutorotate(false);
  };

  const goPrev = () => goTo(active - 1);
  const goNext = () => goTo(active + 1);

  useEffect(() => {
    if (!autorotate || total <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1 === total ? 0 : prev + 1));
    }, autorotateTiming);
    return () => clearInterval(interval);
  }, [active, autorotate, total]);

  useEffect(() => {
    if (testimonialsRef.current?.parentElement) {
      testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
    }
  }, [active]);

  if (!current || total === 0) return null;

  return (
    <div className="relative mx-auto w-full max-w-3xl text-center">
      <div className="relative h-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-purple-500/25 before:via-purple-500/5 before:via-25% before:to-purple-500/0 before:to-75%">
          <div className="h-32 [mask-image:linear-gradient(0deg,transparent,#fff_20%,#fff)]">
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className={`absolute inset-0 -z-10 h-full transition duration-700 ease-[cubic-bezier(0.68,-0.3,0.32,1)] ${
                  active === index
                    ? 'opacity-100 rotate-0'
                    : 'pointer-events-none opacity-0 -rotate-[60deg]'
                }`}
                aria-hidden={active !== index}
              >
                {testimonial.img ? (
                  <img
                    className="relative left-1/2 top-11 h-14 w-14 -translate-x-1/2 rounded-full border-2 border-purple-500/30 object-cover"
                    src={testimonial.img}
                    width={56}
                    height={56}
                    alt={testimonial.name}
                  />
                ) : (
                  <div className="relative left-1/2 top-11 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-purple-500/30 bg-purple-800 text-sm font-bold tracking-wide text-white">
                    {getInitials(testimonial.name)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 transition-all delay-300 duration-150 ease-in-out">
        <div className="relative flex flex-col" ref={testimonialsRef}>
          {testimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.quote}-${index}`}
              className={`transition duration-500 ease-in-out ${
                active === index
                  ? 'relative order-first translate-x-0 opacity-100 delay-200'
                  : 'pointer-events-none absolute translate-x-4 opacity-0'
              }`}
              aria-hidden={active !== index}
            >
              <div className="text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
                &ldquo;{testimonial.quote}&rdquo;
              </div>
              <div className="mt-5 text-sm font-semibold text-purple-900">
                {testimonial.name}
                {(testimonial.role || testimonial.company) && (
                  <span className="mt-1 block font-medium text-slate-500">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={goPrev}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-purple-200 bg-white text-purple-800 shadow-sm transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-purple-300"
        >
          <LeftOutlined />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              onClick={() => goTo(index)}
              className={`h-2.5 cursor-pointer rounded-full transition-all ${
                active === index ? 'w-7 bg-purple-800' : 'w-2.5 bg-purple-200 hover:bg-purple-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next testimonial"
          onClick={goNext}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-purple-200 bg-white text-purple-800 shadow-sm transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-purple-300"
        >
          <RightOutlined />
        </button>
      </div>

      <p className="mt-4 text-xs font-medium tracking-wide text-slate-400">
        {active + 1} / {total}
      </p>
    </div>
  );
}

export default TestimonialSlider;

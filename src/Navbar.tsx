// Stealth UI navbar, adapted for vertical application menus.
// Copyright (c) 2026 Paragon. MIT: /licenses/stealth-ui-MIT.txt.
// https://www.stealth.pm/ui/navbar
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { createContext, use, useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type RefObject } from 'react';
import './navbar.css';

const classes = (...values: (string | undefined)[]) => values.filter(Boolean).join(' ');
const spring = { type: 'spring', stiffness: 650, damping: 45, mass: .5 } as const;

export function Navbar({ target, className, ...props }: ComponentProps<'div'> & { target: RefObject<HTMLElement | null> }) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    let frame = 0;
    const update = () => { frame = 0; setCompact(element.scrollTop > 8); };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    element.addEventListener('scroll', scroll, { passive: true }); update();
    return () => { element.removeEventListener('scroll', scroll); cancelAnimationFrame(frame); };
  }, [target]);
  return <div {...props} data-slot="navbar" data-orientation="vertical" data-compact={compact || undefined} className={classes('stealth-navbar', className)}/>;
}

export function NavbarBrand({ render, className, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({ defaultTagName: 'a', render, props: mergeProps<'a'>({ className: classes('stealth-navbar-brand', className) }, props) });
}

export function NavbarActions({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={classes('stealth-navbar-actions', className)}/>;
}

const PillContext = createContext<{ enter: (element: HTMLElement) => void } | null>(null);

export function NavbarLinks({ className, children, 'aria-label': label, ...props }: ComponentProps<'ul'>) {
  const reduce = useReducedMotion(), listRef = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0), width = useMotionValue(0), height = useMotionValue(0);
  const [on, setOn] = useState(false), shown = useRef(false), hovering = useRef(false);
  const moveTo = useCallback((element: HTMLElement | null) => {
    if (!element) { shown.current = false; setOn(false); return; }
    const positions = [[x, element.offsetLeft], [y, element.offsetTop], [width, element.offsetWidth], [height, element.offsetHeight]] as const;
    for (const [value, next] of positions) {
      if (shown.current && !reduce) animate(value, next, spring);
      else value.jump(next);
    }
    shown.current = true; setOn(true);
  }, [reduce, x, y, width, height]);
  const home = useCallback(() => moveTo(listRef.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? null), [moveTo]);
  useLayoutEffect(() => { if (!hovering.current) home(); });
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const resize = new ResizeObserver(() => { if (!hovering.current) home(); });
    resize.observe(list); return () => resize.disconnect();
  }, [home]);
  return <PillContext value={{ enter: element => { hovering.current = true; moveTo(element); } }}>
    <nav aria-label={label} className="stealth-navbar-navigation">
      <ul {...props} ref={listRef} className={classes('stealth-navbar-links', className)}
        onPointerLeave={() => { hovering.current = false; home(); }}>
        <motion.li aria-hidden="true" className="stealth-navbar-pill" style={{ x, y, width, height }} initial={false}
          animate={{ opacity: on ? 1 : 0 }} transition={{ duration: reduce ? 0 : on ? .12 : .15 }}/>
        {children}
      </ul>
    </nav>
  </PillContext>;
}

export function NavbarLink({ active = false, render, className, onPointerEnter, ...props }: useRender.ComponentProps<'a'> & { active?: boolean }) {
  const pill = use(PillContext);
  const element = useRender({ defaultTagName: 'a', render, props: mergeProps<'a'>({
    'aria-current': active ? 'page' : undefined,
    onPointerEnter: event => { onPointerEnter?.(event); if (event.pointerType !== 'touch') pill?.enter(event.currentTarget); },
    className: classes('stealth-navbar-link', className),
  }, props) });
  return <li className="stealth-navbar-item">{element}</li>;
}

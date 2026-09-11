/**
 * Split point for Framer Motion's DOM feature set.
 *
 * LazyMotion in components/ui/MotionProvider.tsx imports this dynamically, so
 * the animation features land in their own chunk instead of the initial route
 * JS. Keep this file a single re-export — anything else added here ships with
 * the features bundle.
 */
import { domAnimation } from "framer-motion";

export default domAnimation;

import { Popover, Slider, Toggle } from 'radix-ui';
import { Checkbox } from 'radix-ui';
// import { CheckIcon } from '@radix-ui/react-icons';
import styles from './styles.module.css';
import { FontItalicIcon } from '@radix-ui/react-icons';

const ToggleDemo = () => (
  <Toggle.Root className={styles.Toggle} aria-label="Toggle italic">
    <FontItalicIcon />
  </Toggle.Root>
);

const CheckboxDemo = () => (
  //   <div style={{ display: 'flex', alignItems: 'center' }}>
  <Checkbox.Root className={styles.Root} defaultChecked id="c1">
    <Checkbox.Indicator className={styles.Indicator}>
      {/* <CheckIcon /> */}
      Very important
    </Checkbox.Indicator>
  </Checkbox.Root>
  //     <label className={styles.Label} htmlFor="c1">
  //       Accept terms and conditions.
  //     </label>
  //   </div>
);

const PopoverDemo = () => (
  <Popover.Root>
    <Popover.Trigger>More info</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content>
        Some more info…
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

const SliderDemo = () => (
  <form>
    <Slider.Root
      className={styles.SliderRoot}
      defaultValue={[50]}
      max={100}
      step={1}
    >
      <Slider.Track className={styles.Track}>
        <Slider.Range
          style={{
            background: 'pink',
            height: '100%',
            position: 'absolute',
            width: '80%',
          }}
        >
          Test
        </Slider.Range>
        <Slider.Range className={styles.Range} />
        {/* <Slider.Range style={{ background: 'pink', height: 100 }}>
          Another
        </Slider.Range> */}
      </Slider.Track>
      <Slider.Thumb className={styles.Thumb} aria-label="Volume"></Slider.Thumb>
    </Slider.Root>
  </form>
);

/**
 * @description This page demonstrates building a completely react-only Media Player UI using Media Chrome's react-specific
 * MediaStore integration (hooks, context providers, etc.). While this example uses Material UI components, you can of course
 * use any component library you'd like (or DIY using vanilla React).
 */
export default function Page() {
  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24 w-screen">
    <main
      className="flex min-h-screen flex-col p-24 w-screen"
      style={{ background: 'grey' }}
    >
      <ToggleDemo />
      <PopoverDemo />
      <Popover.Root>
        <Popover.Trigger>Even More info</Popover.Trigger>
      </Popover.Root>
      <CheckboxDemo />
      <SliderDemo />
    </main>
  );
}

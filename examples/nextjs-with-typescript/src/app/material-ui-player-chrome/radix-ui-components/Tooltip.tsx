'use client';
import { Tooltip as RadixTooltip } from "radix-ui";
import styles from "./styles.tooltip.module.css";
import type { ReactNode } from "react";

const Tooltip = ({ children, content = '' }: { children: ReactNode, content: ReactNode }) => {
	return (
		<RadixTooltip.Provider>
			<RadixTooltip.Root>
				<RadixTooltip.Trigger asChild>
					{children}
				</RadixTooltip.Trigger>
				<RadixTooltip.Portal>
					<RadixTooltip.Content className={styles.Content} sideOffset={5}>
						{content}
					</RadixTooltip.Content>
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
};

export default Tooltip;
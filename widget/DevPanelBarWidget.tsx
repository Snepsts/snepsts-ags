import Icon from '../components/Icon'
import { Children } from '../lib/common'
import DevPanel from './DevPanel'

type Props = {
	children?: Children
}

export default function DevPanelBarWidget(props: Props) {
	return (
		<menubutton class="button-style">
			<Icon iconName="developer-board-symbolic" />
			<popover>
				<DevPanel />
			</popover>
		</menubutton>
	)
}

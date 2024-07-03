import ActionButton from '../buttons/ActionButton';
import { BUTTON_STYLE } from '@/app/utilities/constants';
import CircleRight from '../../images/CircleRightOrg.svg';
import styles from './learnMore.module.css';

interface LearnMoreProps {
  dest: string;
}

const LearnMore = ({ dest }: LearnMoreProps) => {
  return (
    <ActionButton
      label='Learn more'
      icon={CircleRight}
      style={BUTTON_STYLE.Tertiary}
      className={styles.tertiaryBtn}
      iconPosition='right'
      to={dest}
    />
  );
};

export default LearnMore;

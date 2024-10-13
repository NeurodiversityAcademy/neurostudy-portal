'use client';
import CardList from './article/card';
import ButtonDisplay from './buttons/ButtonDisplay';
import DisplayPodcast from './podcast/DisplayPodcast';
import Example from './typography/Example';
import styles from '../page.module.css';
import BadgeDisplay from './badges/BadgeDisplay';
import Typography, { TypographyVariant } from './typography/Typography';
import TextBox from '@/app/components/formElements/TextBox/TextBox';
import { EMAIL_REGEX, FORM_ELEMENT_COL_WIDTH } from '../utilities/constants';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import Form from '@/app/components/formElements/Form';
import TextArea from '@/app/components/formElements/TextArea/TextArea';
import Radio from './formElements/Radio/Radio';
import CheckBox from './formElements/CheckBox/CheckBox';
import Dropdown from './formElements/Dropdown/Dropdown';
import Toggle from './formElements/Toggle/Toggle';
import Slider from './formElements/Slider/Slider';
import CourseCard from './course/CourseCard';
import { DEFAULT_COURSE } from '../utilities/db/constants';
import CourseSecondaryFilter from './course/CourseSecondaryFilter';
import CoursePrimaryFilter from './course/CoursePrimaryFilter';
import { useEffect, useRef } from 'react';
import CourseProvider from '../utilities/course/CourseProvider';

interface LoginFieldValues extends FieldValues {
  username: string;
  password: string;
}

export default function Components() {
  const containerRef = useRef<HTMLElement>(null);
  const methods: UseFormReturn<LoginFieldValues> = useForm<LoginFieldValues>({
    mode: 'onBlur',
  });

  useEffect(() => {
    const invalidateSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const forms = containerRef.current?.querySelectorAll('form');

    if (forms) {
      forms.forEach((form: HTMLFormElement) => {
        form.addEventListener('submit', invalidateSubmit);
      });

      return () => {
        forms.forEach((form: HTMLFormElement) => {
          form.removeEventListener('submit', invalidateSubmit);
        });
      };
    }
  }, []);

  return (
    <main ref={containerRef} className={styles.main}>
      <Typography variant={TypographyVariant.H1}>Components</Typography>
      <Typography variant={TypographyVariant.H2}>
        Background & Badges
      </Typography>
      <BadgeDisplay />
      <div className={styles.border}>
        <Typography variant={TypographyVariant.H2}>Buttons</Typography>
        <ButtonDisplay />
      </div>{' '}
      <div className={styles.border}>
        <div>
          <Typography variant={TypographyVariant.H2}>Text</Typography>
        </div>
        <br />
        <Example />
      </div>
      <div>
        <Typography variant={TypographyVariant.H2}>
          Cards/Articles/Blog posts
        </Typography>
        <CardList />
      </div>
      <CourseProvider data={[DEFAULT_COURSE]}>
        <div className={styles.courseComponentContainer}>
          <Typography variant={TypographyVariant.H2}>Course</Typography>
          <div>
            <Typography variant={TypographyVariant.H3}>
              Primary Filter
            </Typography>
            <CoursePrimaryFilter />
          </div>
          <div className={styles.flexRow}>
            <div>
              <Typography variant={TypographyVariant.H3}>
                Secondary Filter
              </Typography>
              <CourseSecondaryFilter />
            </div>
            <div>
              <Typography variant={TypographyVariant.H3}>Card</Typography>
              <CourseCard course={DEFAULT_COURSE} />
            </div>
          </div>
        </div>
      </CourseProvider>
      <div className={styles.border}>
        <Typography variant={TypographyVariant.H2}>Podcast embed</Typography>
        <DisplayPodcast
          scriptSrc='https://www.buzzsprout.com/2132579.js?container_id=buzzsprout-large-player&player=large'
          containerId='buzzsprout-large-player'
          singleBlog={false}
        />
      </div>
      <div className={styles.form}>
        <Form methods={methods} onSubmit={() => {}}>
          <Typography variant={TypographyVariant.H2}>Textboxes</Typography>
          <Typography variant={TypographyVariant.Body2}>Regular</Typography>
          <TextBox
            name='username1'
            type='email'
            label='Email Address'
            required
            placeholder='Email address'
            pattern={EMAIL_REGEX}
            cols={FORM_ELEMENT_COL_WIDTH.HALF}
          />
          <Typography variant={TypographyVariant.Body2}>Full Width</Typography>
          <TextBox
            name='username3'
            type='email'
            label='Email Address'
            required
            placeholder='Email address'
            pattern={EMAIL_REGEX}
          />
          <Typography variant={TypographyVariant.H2}>TextArea</Typography>
          <Typography variant={TypographyVariant.Body2}>Regular</Typography>
          <TextArea
            name='message1'
            label='Message'
            showLabel
            placeholder={'Enter your message'}
            rules={{
              maxLength: 300,
            }}
            cols={FORM_ELEMENT_COL_WIDTH.HALF}
          ></TextArea>
          <Typography variant={TypographyVariant.Body2}>Full Width</Typography>
          <TextArea
            name='message2'
            label='Message'
            showLabel
            placeholder={'Enter your message'}
            rules={{
              maxLength: 300,
            }}
          ></TextArea>
          <CheckBox
            name='test-checkbox-1'
            label='Checkbox - Vertical'
            showLabel
            options={[
              { label: 'Item 1', value: 'Item 1' },
              { label: 'Item 2', value: 'Item 2' },
              { label: 'Item 3', value: 'Item 3' },
            ]}
            orientation='vertical'
          />
          <CheckBox
            name='test-checkbox-2'
            label='Checkbox - Horizontal'
            showLabel
            options={[
              { label: 'Item 1', value: 'Item 1' },
              { label: 'Item 2', value: 'Item 2' },
              { label: 'Item 3', value: 'Item 3' },
            ]}
          />
          <Radio
            name='test-radio-1'
            label='Radio Button - Vertical'
            showLabel
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
            orientation='vertical'
          />
          <Radio
            name='test-radio-2'
            label='Radio Button - Horizontal'
            showLabel
            options={[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ]}
          />
          <Toggle name='test-toggle-1' label='Toggle' showLabel />
          <Slider name='test-slider-1' label='Slider' showLabel cols={3} />
          <Dropdown
            name='test-dropdown-no-pill-1'
            label='Dropdown - No pill & Single selection'
            showLabel
            placeholder='Choose an item'
            options={[
              { label: 'Item 1', value: 'Item 1' },
              { label: 'Item 2', value: 'Item 2' },
              { label: 'Item 3', value: 'Item 3' },
              { label: 'Item 4', value: 'Item 4' },
              { label: 'Item 5', value: 'Item 5' },
            ]}
            multiple={false}
          />
          <Dropdown
            name='test--dropdown-pill-1'
            label='Pills & Dropdown'
            showLabel
            placeholder='Choose any 3'
            options={[
              { label: 'Item 1', value: 'Item 1' },
              { label: 'Item 2', value: 'Item 2' },
              { label: 'Item 3', value: 'Item 3' },
              { label: 'Item 4', value: 'Item 4' },
              { label: 'Item 5', value: 'Item 5' },
            ]}
            multiple
            rules={{
              validate: {
                limit3: (value: string[]) =>
                  (value?.length || 0) <= 3 || 'Choose at most 3.',
              },
            }}
          />
        </Form>
      </div>
    </main>
  );
}

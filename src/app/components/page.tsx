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

interface LoginFieldValues extends FieldValues {
  username: string;
  password: string;
}

export default function Components() {
  const methods: UseFormReturn<LoginFieldValues> = useForm<LoginFieldValues>({
    mode: 'onBlur',
  });

  return (
    <main className={styles.main}>
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
            colWidth={FORM_ELEMENT_COL_WIDTH.HALF}
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
        </Form>
      </div>
    </main>
  );
}

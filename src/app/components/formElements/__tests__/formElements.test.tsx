import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useForm, FormProvider, FieldValues } from 'react-hook-form';
import TextBox from '../TextBox/TextBox';
import TextArea from '../TextArea/TextArea';
import Dropdown from '../Dropdown/Dropdown';
import CheckBox from '../CheckBox/CheckBox';
import Radio from '../Radio/Radio';
import Toggle from '../Toggle/Toggle';
import Slider from '../Slider/Slider';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, ...rest } = props;
    const imgSrc = typeof src === 'object' && src !== null
      ? (src as { src?: string }).src || ''
      : String(src || '');
    return <img {...rest} src={imgSrc} />;
  },
}));

interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: FieldValues;
  onSubmit?: (data: FieldValues) => void;
}

function TestWrapper({ children, defaultValues = {}, onSubmit }: WrapperProps) {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined}>
        {children}
        {onSubmit && <button type="submit">Submit</button>}
      </form>
    </FormProvider>
  );
}

describe('TextBox', () => {
  it('renders with placeholder', () => {
    render(
      <TestWrapper>
        <TextBox name="username" label="Username" placeholder="Enter username" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <TextBox name="email" label="Email" showLabel placeholder="email" />
      </TestWrapper>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(
      <TestWrapper>
        <TextBox name="name" label="Name" showLabel required />
      </TestWrapper>
    );
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('allows user to type', () => {
    render(
      <TestWrapper>
        <TextBox name="name" label="Name" placeholder="Name" />
      </TestWrapper>
    );
    const input = screen.getByPlaceholderText('Name');
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input).toHaveValue('John');
  });

  it('shows error when required field is empty on submit', async () => {
    const onSubmit = jest.fn();
    render(
      <TestWrapper onSubmit={onSubmit}>
        <TextBox name="name" label="Name" showLabel required />
      </TestWrapper>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });
    await waitFor(() => {
      expect(screen.getByText('Name is invalid.')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('populates with defaultValues from form context', () => {
    render(
      <TestWrapper defaultValues={{ name: 'Default' }}>
        <TextBox name="name" label="Name" placeholder="Name" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Default');
  });

  it('renders with type="password"', () => {
    render(
      <TestWrapper>
        <TextBox name="pass" label="Password" type="password" placeholder="Password" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  it('calls onChange callback', () => {
    const handleChange = jest.fn();
    render(
      <TestWrapper>
        <TextBox name="field" label="Field" placeholder="Field" onChange={handleChange} />
      </TestWrapper>
    );
    fireEvent.change(screen.getByPlaceholderText('Field'), { target: { value: 'x' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows clear button when value exists', () => {
    render(
      <TestWrapper defaultValues={{ name: 'Hello' }}>
        <TextBox name="name" label="Name" placeholder="Name" />
      </TestWrapper>
    );
    expect(screen.getByLabelText('Clear')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <TextBox name="field" label="Field" helperText="Some help" placeholder="x" />
      </TestWrapper>
    );
    expect(screen.getByText('Some help')).toBeInTheDocument();
  });
});

describe('TextArea', () => {
  it('renders textarea with placeholder', () => {
    render(
      <TestWrapper>
        <TextArea name="bio" label="Bio" placeholder="Tell us about yourself" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us about yourself').tagName).toBe('TEXTAREA');
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <TextArea name="bio" label="Biography" showLabel placeholder="bio" />
      </TestWrapper>
    );
    expect(screen.getByText('Biography')).toBeInTheDocument();
  });

  it('allows user to type', () => {
    render(
      <TestWrapper>
        <TextArea name="bio" label="Bio" placeholder="Bio" />
      </TestWrapper>
    );
    const textarea = screen.getByPlaceholderText('Bio');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(textarea).toHaveValue('Hello world');
  });

  it('shows error when required field is empty on submit', async () => {
    const onSubmit = jest.fn();
    render(
      <TestWrapper onSubmit={onSubmit}>
        <TextArea name="desc" label="Description" showLabel required />
      </TestWrapper>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });
    await waitFor(() => {
      expect(screen.getByText('Description is invalid.')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('populates with defaultValues from form context', () => {
    render(
      <TestWrapper defaultValues={{ bio: 'Default bio' }}>
        <TextArea name="bio" label="Bio" placeholder="Bio" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Bio')).toHaveValue('Default bio');
  });

  it('renders with custom rows', () => {
    render(
      <TestWrapper>
        <TextArea name="notes" label="Notes" placeholder="Notes" rows={10} />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Notes')).toHaveAttribute('rows', '10');
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <TextArea name="notes" label="Notes" helperText="Max 500 chars" placeholder="x" />
      </TestWrapper>
    );
    expect(screen.getByText('Max 500 chars')).toBeInTheDocument();
  });
});

describe('Dropdown', () => {
  const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  it('renders with placeholder', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} placeholder="Select fruit" />
      </TestWrapper>
    );
    expect(screen.getByPlaceholderText('Select fruit')).toBeInTheDocument();
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} showLabel />
      </TestWrapper>
    );
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('shows options when focused', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} placeholder="Select" />
      </TestWrapper>
    );
    fireEvent.focus(screen.getByPlaceholderText('Select'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('selects an option on click', async () => {
    render(
      <TestWrapper>
        <Dropdown
          name="fruit"
          label="Fruit"
          options={options}
          placeholder="Select"
          closeOnSelect
        />
      </TestWrapper>
    );
    fireEvent.focus(screen.getByPlaceholderText('Select'));
    fireEvent.click(screen.getByText('Apple'));
    await waitFor(() => {
      expect(screen.getByDisplayValue('apple')).toBeInTheDocument();
    });
  });

  it('filters options when searchable', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} placeholder="Search" searchable />
      </TestWrapper>
    );
    const input = screen.getByPlaceholderText('Search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ban' } });
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  it('shows error when required and no selection on submit', async () => {
    const onSubmit = jest.fn();
    render(
      <TestWrapper onSubmit={onSubmit}>
        <Dropdown
          name="fruit"
          label="Fruit"
          options={options}
          showLabel
          required
        />
      </TestWrapper>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });
    await waitFor(() => {
      expect(screen.getByText('Please make a selection')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders with combobox role', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} />
      </TestWrapper>
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <Dropdown name="fruit" label="Fruit" options={options} helperText="Pick one" />
      </TestWrapper>
    );
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('supports multiple selection', () => {
    render(
      <TestWrapper>
        <Dropdown
          name="fruits"
          label="Fruits"
          options={options}
          multiple
          placeholder="Select"
        />
      </TestWrapper>
    );
    fireEvent.focus(screen.getByPlaceholderText('Select'));
    fireEvent.click(screen.getByText('Apple'));
    fireEvent.click(screen.getByText('Banana'));
    const hiddenInputs = screen.getAllByDisplayValue(/apple|banana/);
    expect(hiddenInputs.length).toBeGreaterThanOrEqual(2);
  });
});

describe('CheckBox', () => {
  const options = [
    { label: 'Reading', value: 'reading' },
    { label: 'Writing', value: 'writing' },
    { label: 'Coding', value: 'coding' },
  ];

  it('renders all options', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} />
      </TestWrapper>
    );
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Writing')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} showLabel />
      </TestWrapper>
    );
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
  });

  it('renders as a group', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} />
      </TestWrapper>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('selects and deselects an option on click', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} />
      </TestWrapper>
    );
    const readingBtn = screen.getByText('Reading').closest('button')!;
    fireEvent.click(readingBtn);
    expect(screen.getByDisplayValue('reading')).toBeInTheDocument();

    fireEvent.click(readingBtn);
    expect(screen.queryByDisplayValue('reading')).not.toBeInTheDocument();
  });

  it('supports multiple selections', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Reading').closest('button')!);
    fireEvent.click(screen.getByText('Coding').closest('button')!);
    expect(screen.getByDisplayValue('reading')).toBeInTheDocument();
    expect(screen.getByDisplayValue('coding')).toBeInTheDocument();
  });

  it('shows error when required and no selection on submit', async () => {
    const onSubmit = jest.fn();
    render(
      <TestWrapper onSubmit={onSubmit}>
        <CheckBox
          name="hobbies"
          label="Hobbies"
          options={options}
          showLabel
          required
          defaultErrorMessage="Select at least one"
        />
      </TestWrapper>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });
    await waitFor(() => {
      expect(screen.getByText('Select at least one')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <CheckBox name="hobbies" label="Hobbies" options={options} helperText="Pick hobbies" />
      </TestWrapper>
    );
    expect(screen.getByText('Pick hobbies')).toBeInTheDocument();
  });
});

describe('Radio', () => {
  const options = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  it('renders all options', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} />
      </TestWrapper>
    );
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} showLabel />
      </TestWrapper>
    );
    expect(screen.getByText('Gender')).toBeInTheDocument();
  });

  it('renders as a group', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} />
      </TestWrapper>
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('selects an option on click', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Male').closest('button')!);
    expect(screen.getByDisplayValue('male')).toBeInTheDocument();
  });

  it('only allows one option to be selected at a time', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Male').closest('button')!);
    fireEvent.click(screen.getByText('Female').closest('button')!);
    expect(screen.getByDisplayValue('female')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('male')).not.toBeInTheDocument();
  });

  it('shows error when required and no selection on submit', async () => {
    const onSubmit = jest.fn();
    render(
      <TestWrapper onSubmit={onSubmit}>
        <Radio
          name="gender"
          label="Gender"
          options={options}
          showLabel
          required
          defaultErrorMessage="Please select a gender"
        />
      </TestWrapper>
    );
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });
    await waitFor(() => {
      expect(screen.getByText('Please select a gender')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} helperText="Select your gender" />
      </TestWrapper>
    );
    expect(screen.getByText('Select your gender')).toBeInTheDocument();
  });

  it('calls onChange callback when option is selected', () => {
    const handleChange = jest.fn();
    render(
      <TestWrapper>
        <Radio name="gender" label="Gender" options={options} onChange={handleChange} />
      </TestWrapper>
    );
    fireEvent.click(screen.getByText('Male').closest('button')!);
    expect(handleChange).toHaveBeenCalledWith('male');
  });
});

describe('Toggle', () => {
  it('renders with default on/off options', () => {
    render(
      <TestWrapper>
        <Toggle name="notifications" label="Notifications" showLabel />
      </TestWrapper>
    );
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('toggles on click', () => {
    render(
      <TestWrapper defaultValues={{ active: false }}>
        <Toggle name="active" label="Active" showLabel />
      </TestWrapper>
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    fireEvent.change(checkbox, { target: { checked: true } });
    expect(checkbox).toBeChecked();
  });

  it('renders custom options labels', () => {
    render(
      <TestWrapper defaultValues={{ mode: 'yes' }}>
        <Toggle
          name="mode"
          label="Mode"
          showLabel
          options={{
            on: { label: 'Yes', value: 'yes' },
            off: { label: 'No', value: 'no' },
          }}
        />
      </TestWrapper>
    );
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('shows off label when value is off', () => {
    render(
      <TestWrapper defaultValues={{ mode: 'no' }}>
        <Toggle
          name="mode"
          label="Mode"
          options={{
            on: { label: 'Yes', value: 'yes' },
            off: { label: 'No', value: 'no' },
          }}
        />
      </TestWrapper>
    );
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders a hidden input with the current value', () => {
    render(
      <TestWrapper defaultValues={{ active: true }}>
        <Toggle name="active" label="Active" />
      </TestWrapper>
    );
    expect(screen.getByDisplayValue('true')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <Toggle name="active" label="Active" helperText="Toggle on or off" />
      </TestWrapper>
    );
    expect(screen.getByText('Toggle on or off')).toBeInTheDocument();
  });

  it('shows label when showLabel is true', () => {
    render(
      <TestWrapper>
        <Toggle name="active" label="Active" showLabel />
      </TestWrapper>
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

describe('Slider', () => {
  it('renders a range input', () => {
    render(
      <TestWrapper>
        <Slider name="volume" label="Volume" min={0} max={100} step={1} />
      </TestWrapper>
    );
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders label when showLabel is true', () => {
    render(
      <TestWrapper>
        <Slider name="volume" label="Volume" showLabel min={0} max={100} step={1} />
      </TestWrapper>
    );
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('has correct min, max, step attributes', () => {
    render(
      <TestWrapper>
        <Slider name="rating" label="Rating" min={1} max={10} step={0.5} />
      </TestWrapper>
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '1');
    expect(slider).toHaveAttribute('max', '10');
    expect(slider).toHaveAttribute('step', '0.5');
  });

  it('allows user to change value', () => {
    render(
      <TestWrapper defaultValues={{ volume: 50 }}>
        <Slider name="volume" label="Volume" min={0} max={100} step={1} />
      </TestWrapper>
    );
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    expect(slider).toHaveValue('75');
  });

  it('calls onChange callback', () => {
    const handleChange = jest.fn();
    render(
      <TestWrapper defaultValues={{ volume: 50 }}>
        <Slider name="volume" label="Volume" min={0} max={100} step={1} onChange={handleChange} />
      </TestWrapper>
    );
    fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
    expect(handleChange).toHaveBeenCalledWith(80);
  });

  it('defaults to min value when no defaultValue', () => {
    render(
      <TestWrapper>
        <Slider name="brightness" label="Brightness" min={10} max={100} step={5} />
      </TestWrapper>
    );
    expect(screen.getByRole('slider')).toHaveValue('10');
  });

  it('shows helper text', () => {
    render(
      <TestWrapper>
        <Slider name="vol" label="Vol" min={0} max={100} step={1} helperText="Drag to adjust" />
      </TestWrapper>
    );
    expect(screen.getByText('Drag to adjust')).toBeInTheDocument();
  });

  it('uses default min/max/step from constants when not provided', () => {
    render(
      <TestWrapper>
        <Slider name="val" label="Value" />
      </TestWrapper>
    );
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
  });
});

import { useState } from 'react';
import dropdownOptions from '../selectOptions/searchOptionsData.json';
import styles from './searchBar.module.css';
import Search from '../../images/Search.jpg';
import ActionButton from '../buttons/ActionButton';
import SearchSelect from '../searchSelect/SearchSelect';

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
  const [neurotype, setNeurotype] = useState<string>('');
  const [courseOptions, setCourseOptions] = useState<string>('');
  const [locations, setLocations] = useState<string>('');

  const handleSearchSubmit = () => {
    console.log('Selected Neurotype:', neurotype);
    console.log('Selected Course Options:', courseOptions);
    console.log('Selected Locations:', locations);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dropdownGroup}>
        <SearchSelect
          label='What is your neurotype?'
          value={neurotype}
          onChange={(value) => setNeurotype(value)}
          options={dropdownOptions.neurotype}
        />
      </div>
      <div className={styles.dropdownGroup}>
        <SearchSelect
          label='What do you want to study?'
          value={courseOptions}
          onChange={(value) => setCourseOptions(value)}
          options={dropdownOptions.courseOptions}
        />
      </div>
      <div className={styles.dropdownGroup}>
        <SearchSelect
          label='Where do you want to study?'
          value={locations}
          onChange={(value) => setLocations(value)}
          options={dropdownOptions.locations}
        />
      </div>
      <div className={styles.searchButtonWrapper}>
        <ActionButton
          label='Search'
          icon={Search}
          disabled={false}
          onClick={handleSearchSubmit}
        />
      </div>
    </div>
  );
};

export default SearchBar;

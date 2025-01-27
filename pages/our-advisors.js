export default function OurAdvisors() {
  const advisors = [
    {
      ProfilePic: '/Images/Person1.png',
      name: 'Kamala Perera',
      title: 'Head of Support',
      logo: './Images/d2l.png',
    },
    {
      ProfilePic: './Images/Person2.png',
      name: 'Navodh Fernando',
      title: 'Head of Support Ops',
      logo: './Images/carta.png',
    },
    {
      ProfilePic: './Images/Person4.png',
      name: 'Madison Black ',
      title: 'Head of Support Ops',
      logo: './Images/Instacart.png',
    },
    {
      ProfilePic: './Images/Person3.png',
      name: 'Iran Ranasinghe',
      title: 'Head of Support',
      logo: './Images/Pinterest.png',
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Customer Advisory Board</h1>
      <div style={styles.cardContainer}>
        {advisors.map((advisor, index) => (
          <div key={index} style={styles.card}>
            <img src={advisor.ProfilePic} style={styles.image} />
            <h2 style={styles.name}>{advisor.name}</h2>
            <p style={styles.title}>{advisor.title}</p>
            <p style={styles.company}>{advisor.company}</p>
            <img src={advisor.logo} style={styles.logo} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '15px',
    border: '3px solid',
    borderRadius: '25px',
    borderStyle: 'round',
    //borderWidth: '50px',
    //width: '1200px',
  },
  title: {
    fontSize: '17px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#555',
  },
  heading: {
    fontSize: '45px',
    fontWeight: 'bold',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  card: {
    width: '240px',
    height: '350px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  image: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  logo: {
    width: '80px',
    height: '30px',
    borderRadius: '10%',
    marginBottom: '10px',
  },
  name: {
    fontSize: '27px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },

  company: {
    fontSize: '15px',
    color: '#888',
  },
};

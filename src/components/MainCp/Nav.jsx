import CardNav from "../CardNav";
import logo from "../../assets/logo2.png";
import '../CardNav.css';

function Nav() {
return (
      <CardNav
        logo={logo}
        items={[
          { label: 'Academic', bgColor: '#7c3aed', textColor: '#fff', links: [
            { label: 'API', href: '#', ariaLabel: 'Go to dashboard' },
            { label: 'Research', href: '#', ariaLabel: 'View activity' },
            { label: 'Publications', href: '#', ariaLabel: 'View activity' },
          ]},
          { label: 'Services', bgColor: '#2563eb', textColor: '#fff', links: [
            { label: 'Science | 科学与工程', href: '#', ariaLabel: '' },
            { label: 'Acknowledgment | 知识普及', href: '#', ariaLabel: '知识普及' },
            { label: 'Events | 教育活动', href: '#', ariaLabel: 'View activity' },
          ]},
          { label: 'About', bgColor: '#0891b2', textColor: '#fff', links: [
            { label: 'Team', href: '#', ariaLabel: 'Meet the team' },
            { label: 'Contact', href: '#', ariaLabel: 'Contact us' },
          ]},
        ]}
        baseColor="#ffffff"
        menuColor="#4b4453"
        buttonBgColor="#3db4c4"
        buttonTextColor="#ffffff"
      />
  )
}

export default Nav
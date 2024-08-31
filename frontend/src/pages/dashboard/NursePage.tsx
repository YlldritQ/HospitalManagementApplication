import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';
import { FaUserCog } from 'react-icons/fa';

const NursePage = () => {
  return (
    <div className='pageTemplate2'>
      <PageAccessTemplate color='#3b3549' icon={FaUserCog} role='Nurse' />
    </div>
  );
};

export default NursePage;
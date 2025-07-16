
import LeftTopBox from './LeftTopBox'
// import RightTopBox from './RightTopBox'
import LeftBottomBox from './LeftBottomBox'

const DashboardBody = () => {
  return (
    <div className="dashboardGrid">
      <LeftTopBox/>
      {/* <RightTopBox/> */}
      <LeftBottomBox/>
    </div>
  )
}

export default DashboardBody

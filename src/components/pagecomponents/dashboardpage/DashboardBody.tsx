
import LeftTopBox from './LeftTopBox'
// import RightTopBox from './RightTopBox'
// import LeftBottomBox from './LeftBottomBox'
import ChartsBox from './ChartsBox'

const DashboardBody = () => {
  return (
    <div className="dashboardGrid">
      <LeftTopBox/>
      {/* <RightTopBox/> */}
      {/* <LeftBottomBox/> */}
      <ChartsBox/>
    </div>
  )
}

export default DashboardBody

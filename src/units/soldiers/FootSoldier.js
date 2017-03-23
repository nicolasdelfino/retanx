import React from 'react'
import '../../css/FootSoldier.css';
export default class FootSoldier extends React.Component {
  render() {
    return (
      <div class="main">
        <div class="unitWrapper">
          <div id="soldier" class="unit">
            <div class="gunWrapper">
              <div class="gun">
                <div class="barrel" />
              </div>
            </div>
            <div class="body">
              <div class="arms">
                <div class="arm left"></div>
                <div class="arm right"></div>
              </div>
              <div class="head" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

import React from 'react';
import {
  Input,

} from 'antd';

// eslint: react/no-multi-comp.
export default class PortraitImage extends React.Component {

  constructor(props) {
    super(props);
    const { portraitStr } = this.props;
    this.state = {'portraitStr': portraitStr, 'portraitStrDefault': undefined === portraitStr ? 'timg.jpeg' : portraitStr };
    console.log(portraitStr);

    this.handleImgChange = this.handleImgChange.bind(this);
    // this.onErrorFunc = this.onErrorFunc.bind(this);
  }

  // onErrorFunc(){
  //   this.setState({portraitStr: 'timg.jpeg'});
  // }

  handleImgChange(e) {
    this.setState({
      portraitStr: e.target.value,
      portraitStrDefault: e.target.value,
    });
  }

  render() {
    const { portraitStr, portraitStrDefault } = this.state;
    const statement = (
      <div>
        <Input placeholder="头像地址" value={portraitStr} onChange={(e)=>{this.handleImgChange(e)}} />
        <img src={portraitStrDefault} alt='头像' width='100' height='100' onError={(e)=>{e.target.src='timg.jpeg'}} />
      </div>
    );
    // onError={(e)=>{e.target.src='./timg.jpeg'}}
    // onError={this.onErrorFunc}
    return statement;
  }

}

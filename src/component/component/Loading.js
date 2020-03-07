import React, { Component } from 'react';

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let cls = 'full' in this.props ? 'theme-default' : '';
        return (
            <div id="content" className={cls}>
                <div className={"loading-dir"}>
                    <div className="loading" style={{ transform: 'scale(1.3)' }}>
                        <div className="loading-1"></div>
                        <div className="loading-2"></div>
                        <div className="loading-3"></div>
                        <div className="loading-4"></div>
                        <div className="loading-5"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;

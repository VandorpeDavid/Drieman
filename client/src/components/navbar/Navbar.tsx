import React from 'react';
import autobind from 'react-autobind';

interface INavbarProps {

}

interface INavbarState {
    active: boolean;
}

class Navbar extends React.Component<INavbarProps, INavbarState> {
    constructor(props: INavbarProps) {
        super(props);
        this.state = {
            active: false
        };
        autobind(this);
    }

    toggleActive() {
        console.log(this.state)
        this.setState((prevState) => ({
            active: !prevState.active
        }));
    }

    render() {
        const activeClass = this.state.active ? " is-active" : '';

        return <nav id="navbar" className={'navbar' + activeClass}>
            <div id="navbar-brand" className="navbar-brand">
                <a id="brand-logo" className="navbar-item force-center shield noselect" href="/">
                    <img alt="WiNA Schild" className="logo-wordmark logo-shield " src="/wina-logo.svg" />
                </a>

                <a href="#" role="button" className={'navbar-burger ' + activeClass} aria-label="menu" aria-expanded="false" onClick={this.toggleActive}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>


            <div id="navbar-menu" className={'navbar-menu' + activeClass}>
                <div className="navbar-start">
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="buttons">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        </nav>;
    }

}

export default Navbar;
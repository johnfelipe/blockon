import React, { Component, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from 'store/modules/user';
import LoggedInNav from 'components/base/HeaderNav/LoggedInNav';
import LoggedOutNav from 'components/base/HeaderNav/LoggedOutNav';
import * as AuthAPI from 'lib/api/auth';
import './HeaderNav.scss';

export const HeaderNavItem = ({ children, item, to }) => {
  return (
    <Fragment>
      <NavLink to={to} activeClassName="active">
        <li>{children}</li>
      </NavLink>
    </Fragment>
  );
};

/**
 * 헤더 아이템 컴포넌트
 * @param activeItem 현재 선택된 아이템
 * @param onSelect 아이템 선택 함수
 */
class HeaderNav extends Component {
  state = {
    toggled: false
  };

  // nav 클릭시 토글 변수를 추가해서 변수에 따라 메뉴가 나오고 사라질 수 있게 한다.
  nav_click = () => {
    this.setState({
      toggled: !this.state.toggled
    });
  };

  handleLogout = async () => {
    const { UserActions } = this.props;

    await AuthAPI.logout()
      .then(() => {
        console.log('access-token 쿠키 삭제 성공');
      })
      .catch(() => {
        console.log('access-token 쿠키 삭제 실패');
      });

    localStorage.removeItem('loggedInfo');
    UserActions.logout();
    this.props.history.push('/'); /* / 라우트로 이동 */
  };

  /**
   * 로그인 여부에 따라 로그인/로그아웃 버튼 조건부 렌더링
   */
  getUserButtons = () => {
    const { isLogged } = this.props;

    if (isLogged) {
      return <LoggedInNav handleLogout={this.handleLogout} />;
    } else {
      return <LoggedOutNav />;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // 라우트가 달라지면 모바일 nav menu 닫기
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ toggled: false });
    }
  }

  render() {
    const { toggled } = this.state;

    return (
      <nav className="HeaderNav">
        <div className="nav-mobile">
          <button
            id="nav-toggle"
            onClick={this.nav_click}
            className={toggled ? 'active' : undefined}
          >
            <span />
          </button>
        </div>

        <ul className={toggled ? 'active' : undefined}>
          <HeaderNavItem item="message" to="/search">
            중개소찾기
          </HeaderNavItem>
          {this.getUserButtons()}
        </ul>
      </nav>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  isLogged: user.isLogged
});

const mapDispatchToProps = dispatch => ({
  UserActions: bindActionCreators(userActions, dispatch)
});

// withRouter: 상위 Route 컴포넌트의 history 객체를 props로 넣어줌
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderNav)
);

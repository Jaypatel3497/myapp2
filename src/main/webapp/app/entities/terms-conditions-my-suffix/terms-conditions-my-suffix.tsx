import * as React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction } from 'react-jhipster';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './terms-conditions-my-suffix.reducer';
import { ITermsConditionsMySuffix } from 'app/shared/model/terms-conditions-my-suffix.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITermsConditionsMySuffixProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class TermsConditionsMySuffix extends React.Component<ITermsConditionsMySuffixProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { termsConditionsList, match } = this.props;
    return (
      <div>
        <h2 id="terms-conditions-my-suffix-heading">
          Terms Conditions
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp; Create new Terms Conditions
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descritption</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {termsConditionsList.map((termsConditions, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${termsConditions.id}`} color="link" size="sm">
                      {termsConditions.id}
                    </Button>
                  </td>
                  <td>{termsConditions.descritption}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${termsConditions.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${termsConditions.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${termsConditions.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ termsConditions }: IRootState) => ({
  termsConditionsList: termsConditions.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TermsConditionsMySuffix);

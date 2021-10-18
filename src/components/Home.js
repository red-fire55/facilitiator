import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

// material ui components
import SimpleDialog from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";


class Home extends Component {
  state = {
    open: false,
    password: "",
    start: false
  };
  handleClickOpen = () => {
    this.props.onStart(true)
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  continueToSession = () => {};
  render() {
    return (
      <div>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <h3>Welocme !</h3>
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" onClick={this.handleClickOpen}>
              <Link
                to="/storyTelling"
                style={{ textDecoration: "none", color: "white" }}
              >
                New Session
              </Link>
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;

const { loadFixture, fixtureToInstace } = require('../util')

require('../mocha-node-setup')

describe('api.github.com', () => {
  let githubUserA
  let githubUserB

  beforeEach(() => {
    return loadFixture('add-and-remove-repository-collaborator')

      .then((fixture) => {
        githubUserA = fixtureToInstace(fixture)
        githubUserB = fixtureToInstace(fixture)
      })
  })
  it('add-and-remove-repository-collaborator-test', () => {
    githubUserA.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000001'
    })

    githubUserB.authenticate({
      type: 'token',
      token: '0000000000000000000000000000000000000002'
    })

    return githubUserA.repos.addCollaborator({
      owner: 'octokit-fixture-org',
      repo: 'add-and-remove-repository-collaborator',
      username: 'octokit-fixture-user-b'
    })

      .then(() => {
        return githubUserA.repos.listInvitations({
          owner: 'octokit-fixture-org',
          repo: 'add-and-remove-repository-collaborator'
        })
      })

      .then((response) => {
        expect(response.data.length).to.equal(1)

        return githubUserB.repos.acceptInvitation({
          invitation_id: response.data[0].id
        })
      })

      .then(() => {
        return githubUserA.repos.listCollaborators({
          owner: 'octokit-fixture-org',
          repo: 'add-and-remove-repository-collaborator'
        })
      })

      .then((response) => {
        expect(response.data.length).to.equal(2)

        return githubUserA.repos.removeCollaborator({
          owner: 'octokit-fixture-org',
          repo: 'add-and-remove-repository-collaborator',
          username: 'octokit-fixture-user-b'
        })
      })

      .then(() => {
        return githubUserA.repos.listCollaborators({
          owner: 'octokit-fixture-org',
          repo: 'add-and-remove-repository-collaborator'
        })
      })

      .then((response) => {
        expect(response.data.length).to.equal(1)
      })
  })
})

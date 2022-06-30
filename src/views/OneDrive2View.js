import React from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { BrowserRouter } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';

function OneDrive2View(props) {
    return (
        <>
            <AuthenticatedTemplate>
                <PageLayout>

                </PageLayout>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <PageLayout>
                </PageLayout>
            </UnauthenticatedTemplate>
        </>
    );
}

export default OneDrive2View;